from rest_framework import pagination
from rest_framework.response import Response


class PostPagination(pagination.PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'nextPage': self.page.next_page_number() if self.page.has_next() else None,
            'results': data,
        })
