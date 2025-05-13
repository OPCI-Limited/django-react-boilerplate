from invitation.models import InvitationStatus
from rest_framework import permissions, viewsets

from .models import Event
from .permissions import IsEventCreator, IsEventCreatorOrEventMember
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        """
        Override to apply different permissions for different endpoints.
        """
        permission_classes = [permissions.IsAuthenticated]

        if self.action == 'list' or self.action == 'retrieve':
            permission_classes.append(IsEventCreatorOrEventMember)
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes.append(IsEventCreator)
       
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        # Get events created by the user
        created_events = Event.objects.filter(created_by=user)

        # Get events where the user has accepted an invitation
        accepted_events = Event.objects.filter(
            invitations__invitee=user,
            invitations__status=InvitationStatus.ACCEPTED
        )

        return created_events | accepted_events

