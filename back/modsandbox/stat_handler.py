from django.utils import timezone

from modsandbox.reddit_handler import after_to_datetime


def after_to_time_interval(after, intv):
    now = timezone.now()
    end = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start = after_to_datetime(after)
    diff = (end - start) / intv
    datetime_array = []
    for i in range(intv):
        datetime_array.append((start + diff * i, start + diff * (i + 1)))

    return datetime_array
