from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsEcommerceStaffOrReadOnly(BasePermission):
    """
    Allows access for write permission only to ecommerce staff/admin users .
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff
