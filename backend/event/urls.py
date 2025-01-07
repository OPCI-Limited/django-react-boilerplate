from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, InviteeEventViewSet, InviteeViewSet, NotificationListView, MarkNotificationReadView, UnreadNotificationListView

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'invitees', InviteeViewSet)
router.register(r'invitee_event_view', InviteeEventViewSet, basename='invitee_event_view')

urlpatterns = [
    path('', include(router.urls)),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/mark-read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('notifications/unread/', UnreadNotificationListView.as_view(), name='unread-notification-list'),
]
