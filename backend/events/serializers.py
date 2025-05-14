from django.contrib.auth import get_user_model
from identity.serializers import ReadOnlyUserSerializer
from invitation.models import Invitation
from rest_framework import serializers

from .models import Event

User = get_user_model()

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'location',
            'start_time',
            'end_time',
            'created_by',
        ]
        read_only_fields = ['created_by']



class EventAttendeeSerializer(serializers.ModelSerializer):
    user = ReadOnlyUserSerializer(source='invitee', read_only=True)
    status = serializers.CharField()

    class Meta:
        model = Invitation
        fields = ['user', 'status']