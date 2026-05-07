import {
  getNotificationsService,
} from "../services/notificationService.js";

// GET ALL NOTIFICATIONS
export const getNotifications = async (
  req,
  res
) => {
  try {

    const notifications =
      await getNotificationsService();

    res.status(200).json({
      success: true,
      data: notifications,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};