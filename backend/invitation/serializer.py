from django.contrib.auth import get_user_model
from events.models import Event
from events.serializers import EventSerializer
from rest_framework import serializers

User = get_user_model()

from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        source='event',
        queryset=Event.objects.all(),
        write_only=True
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
            'event_id'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']