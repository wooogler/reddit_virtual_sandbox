import django_filters

from modsandbox.models import Post, Config


class ConfigFilter(django_filters.FilterSet):
    class Meta:
        model = Config
        fields = ['task']


class PostFilter(django_filters.FilterSet):
    start_date = django_filters.DateTimeFilter(lookup_expr='gte', field_name='created_utc')
    end_date = django_filters.DateTimeFilter(lookup_expr="lte", field_name='created_utc')
    source = django_filters.CharFilter(field_name='source', method='filter_source')

    def filter_source(self, queryset, name, value):
        if value == 'Spam':
            return queryset.filter(source__in=['Spam', 'Report'])
        elif value == 'Subreddit':
            return queryset.filter(source='Subreddit')
        return queryset

    class Meta:
        model = Post
        fields = [
            "start_date",
            "end_date",
            "matching_rules",
            "matching_checks",
            "matching_lines",
            "source",
            "place",
            "post_type",
        ]
