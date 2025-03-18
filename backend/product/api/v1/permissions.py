from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsEcommerceStaffOrReadOnly(BasePermission):
    """
    Allows access for write permission only to ecommerce staff/admin users .
    """

    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated and request.user.is_staff
        )
