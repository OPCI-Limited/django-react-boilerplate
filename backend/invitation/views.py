from rest_framework import permissions, viewsets

from .models import Invitation
from .serializer import InvitationSerializer


class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        received_invitations = Invitation.objects.filter(invitee=user)

        status_param = self.request.query_params.get('status', 'pending')
        status_list = [s.strip() for s in status_param.split(',') if s.strip()]

        if 'all' not in status_list:
            received_invitations = received_invitations.filter(status__in=status_list)

        return received_invitations
