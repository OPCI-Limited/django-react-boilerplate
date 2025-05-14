from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import User


class RegistrationSerializer(serializers.ModelSerializer[User]):
    """Serializers registration requests and creates a new user."""

    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.first_name = validated_data.get('first_name', '')
        user.last_name = validated_data.get('last_name', '')
        user.save()
        return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer[User]):
    """Handle serialization and deserialization of User objects."""
    permissions = serializers.SerializerMethodField()
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'groups', 'permissions']
        read_only_fields = ['id', 'email', 'is_staff', 'is_active']

    def get_permissions(self, obj):
        return list(obj.get_group_permissions())


class ReadOnlyUserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']