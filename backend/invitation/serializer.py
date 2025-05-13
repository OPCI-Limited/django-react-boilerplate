from django.contrib.auth import get_user_model
from events.models import Event
from rest_framework import serializers

User = get_user_model()

from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all()
    )
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    invitee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Invitation
        fields = [
            'id',
            'event',
            'created_by',
            'invitee',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']