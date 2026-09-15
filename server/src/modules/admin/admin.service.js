import { User } from '../auth/user.model.js';
import Booking from '../bookings/booking.model.js';
import Event from '../events/event.model.js';
import Category from '../categories/category.model.js';

// -------------------------------------------------------------
// 1. OVERALL COUNTS & REVENUE SUMMARY
// -------------------------------------------------------------
export const fetchDashboardMetrics = async () => {
  // Parallel count queries for fast load times
  const [totalUsers, totalEvents, totalCategories, totalBookings] =
    await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Category.countDocuments(),
      Booking.countDocuments(),
    ]);

  // Aggregate total gross revenue from confirmed/completed bookings
  const revenueAggregation = await Booking.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' },
      },
    },
  ]);

  const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
  const averageOrderValue = Math.round(revenueAggregation[0]?.averageOrderValue || 0);

  // 5 most recent registrations
  const recentUsers = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // 5 most recent bookings with user and event details
  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email')
    .populate('eventId', 'title price')
    .lean();

  return {
    counts: {
      users: totalUsers,
      events: totalEvents,
      categories: totalCategories,
      bookings: totalBookings,
      revenue: totalRevenue,
      averageOrderValue,
    },
    recentUsers,
    recentBookings,
  };
};

// -------------------------------------------------------------
// 2. MONTHLY REVENUE & BOOKINGS TREND (FOR DASHBOARD CHARTS)
// -------------------------------------------------------------
export const fetchMonthlySalesTrends = async () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

  return await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalSales: { $sum: '$totalAmount' },
        bookingCount: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
    {
      $project: {
        month: '$_id',
        totalSales: 1,
        bookingCount: 1,
        _id: 0,
      },
    },
  ]);
};

// -------------------------------------------------------------
// 3. PAGINATED USER RETRIEVAL
// -------------------------------------------------------------
export const fetchUsersList = async ({ page = 1, limit = 10, search = '' }) => {
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
    .limit(limit)
    .lean();

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
    },
  };
};

// -------------------------------------------------------------
// 4. USER ROLE & STATUS UPDATES
// -------------------------------------------------------------
export const modifyUserRole = async (userId, newRole) => {
  return await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, runValidators: true }
  ).select('-password');
};

// -------------------------------------------------------------
// 5. USER DELETION
// -------------------------------------------------------------
export const removeUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};