from rest_framework import viewsets, permissions
from .models import Event, Invitation
from .serializers import EventSerializer, InvitationSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('start_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
