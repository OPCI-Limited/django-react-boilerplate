from rest_framework import status
from rest_framework.reverse import reverse

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from identity.factories import UserFactory, User
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken


class LoginTests(APITestCase):
    @property
    def url(self):
        return reverse('login')

    def setUp(self):
        super(LoginTests, self).setUp()
        self.user = UserFactory()

    def test_login_required_fields(self):
        response = self.client.post(self.url, data={})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {'email': ['This field is required.'],
                                 'password': ['This field is required.']}

    def test_login_valid(self):
        """ Check that we can login with the users password """
        # Check that the user exists and has a valid password
        assert User.objects.filter(email=self.user.email).exists()
        assert self.user.check_password('defaultpassword')

        response = self.client.post(self.url, data={'email': self.user.email, 'password': 'defaultpassword'})
        print(response.data)

        assert response.status_code == status.HTTP_200_OK

    def test_login_invalid_password(self):
        response = self.client.post(self.url, data={'email': self.user.email, 'password': 'abc123'})
        print(response.data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class RegisterTests(APITestCase):
    @property
    def url(self):
        return reverse('register')

    def setUp(self):
        super(RegisterTests, self).setUp()

    def test_register_required_fields(self):
        response = self.client.post(self.url, data={})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == response.data == {'email': ['This field is required.'],
                                                  'password': ['This field is required.']}

    def test_register_valid(self):
        response = self.client.post(self.url, data={'email': 'james.doe@test.com', 'password': 'defaultpassword'})
        print(response.data)

        assert response.status_code == status.HTTP_200_OK

    def test_register_with_name(self):
        response = self.client.post(self.url, data={'email': 'james.doe@test.com', 'password': 'defaultpassword',
                                                    'first_name': 'James', 'last_name': 'Doe'})
        print(response.data)

        assert response.status_code == status.HTTP_200_OK

        user = User.objects.get(id=response.data.get('id'))
        assert user.email == 'james.doe@test.com'
        assert user.first_name == 'James'
        assert user.last_name == 'Doe'


class AuthenticatedAPITestCase(APITestCase):
    """
    Base class for tests that need authenticated access to the APIs.
    """

    def setUp(self):
        self.user = UserFactory()
        self.client = self.get_client(self.user)

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def get_client(self, user=None):
        if user:
            token = self.get_token(user)
            client = self.client_class(HTTP_AUTHORIZATION='Bearer {0}'.format(token))
            client.user = user
            client.auth_token = token
        else:
            return self.client_class()
        return client


class UserTests(AuthenticatedAPITestCase):
    @property
    def url(self):
        return reverse('user')

    def setUp(self):
        super(UserTests, self).setUp()

    def test_retrieve(self):
        response = self.client.get(self.url)
        print(response.data)
        assert response.status_code == status.HTTP_200_OK

    def test_update(self):
        response = self.client.patch(self.url, data={'first_name': 'James', 'last_name': 'Doe'})
        print(response.data)
        assert response.status_code == status.HTTP_200_OK
        self.user.refresh_from_db()
        assert self.user.first_name == 'James'
        assert self.user.last_name == 'Doe'


class JWTFlowTests(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = UserFactory()

    def login(self):
        url = reverse('login')
        response = self.client.post(url, data={'email': self.user.email, 'password': 'defaultpassword'})
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data and 'refresh' in response.data
        return response.data['access'], response.data['refresh']

    def refresh(self, refresh_token):
        url = reverse('refresh')
        return self.client.post(url, data={'refresh': refresh_token})

    def logout(self, refresh_token):
        url = reverse('logout')
        # Authenticate with access token for logout endpoint
        access, _ = self.login()
        client = self.client_class(HTTP_AUTHORIZATION=f'Bearer {access}')
        return client.post(url, data={'refresh': refresh_token})

    def test_refresh_rotates_and_blacklists_old_token(self):
        access, refresh = self.login()

        # First refresh should succeed and return a new refresh token (rotation)
        r1 = self.refresh(refresh)
        assert r1.status_code == status.HTTP_200_OK
        assert 'access' in r1.data
        assert 'refresh' in r1.data
        new_refresh = r1.data['refresh']

        # Reusing old refresh should now fail (blacklisted)
        r2 = self.refresh(refresh)
        assert r2.status_code == status.HTTP_401_UNAUTHORIZED

        # Using the rotated refresh should succeed
        r3 = self.refresh(new_refresh)
        assert r3.status_code == status.HTTP_200_OK

    def test_logout_blacklists_refresh(self):
        access, refresh = self.login()
        # Call logout with the current refresh token
        url = reverse('logout')
        client = self.client_class(HTTP_AUTHORIZATION=f'Bearer {access}')
        resp = client.post(url, data={'refresh': refresh})
        assert resp.status_code == status.HTTP_205_RESET_CONTENT

        # Attempting to refresh with that token should now fail
        r = self.refresh(refresh)
        assert r.status_code == status.HTTP_401_UNAUTHORIZED


class AdminLogoutAllTests(APITestCase):
    def setUp(self):
        super().setUp()
        User = get_user_model()
        self.admin = User.objects.create_superuser(email='admin@example.com', password='adminpass')
        self.user = UserFactory()

        # Issue two refresh tokens so there are multiple OutstandingToken records
        RefreshToken.for_user(self.user)
        RefreshToken.for_user(self.user)

    def test_admin_action_blacklists_all_tokens(self):
        # Ensure tokens exist
        assert OutstandingToken.objects.filter(user=self.user).count() >= 2

        # Log in to admin
        client = self.client_class()
        client.force_login(self.admin)

        # Perform the admin action
        changelist_url = '/admin/identity/user/'
        response = client.post(changelist_url, {
            'action': 'logout_all_sessions',
            '_selected_action': [str(self.user.id)],
            'index': 0,
            'select_across': 0,
        }, follow=True)

        assert response.status_code == 200

        # All outstanding tokens for the user should be blacklisted
        user_tokens = OutstandingToken.objects.filter(user=self.user)
        for t in user_tokens:
            assert BlacklistedToken.objects.filter(token=t).exists()
