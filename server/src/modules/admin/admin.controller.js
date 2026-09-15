import { User } from '../auth/user.model.js';
import { Booking } from '../bookings/booking.model.js';
import { Event } from '../events/event.model.js';
import { Category } from '../categories/category.model.js';

// 1. DASHBOARD OVERVIEW & STATS
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalCategories, totalBookings] =
      await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Category.countDocuments(),
        Booking.countDocuments(),
      ]);

    const [revenueResult, trendsResult] = await Promise.all([
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            totalSales: { $sum: '$totalPrice' },
            bookingCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            year: '$_id.year',
            totalSales: 1,
            bookingCount: 1,
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const avgOrder = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('eventId', 'title pricePerSeat date location');

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          events: totalEvents,
          categories: totalCategories,
          bookings: totalBookings,
          revenue: totalRevenue,
          averageOrderValue: avgOrder,
        },
        trends: trendsResult,
        recentUsers,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics',
    });
  }
};

// 2. GET ALL USERS (Fixes the missing export error)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit) || 1,
          limit,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

// 3. UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'user' or 'admin'",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role',
    });
  }
};

// 4. DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id?.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};