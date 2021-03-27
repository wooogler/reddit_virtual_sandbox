from .models import Log, Profile
import logging

logger = logging.getLogger(__name__)


def log(user, log_type, log_content):
    Log.objects.create(user=user, log_type=log_type, log_content=log_content)
    profile = Profile.objects.get(user=user)
    if log_type == "WF":
        logger.info(
            profile.username + "-" + log_type + ":" + str(len(log_content.split(",")))
        )
    else:
        logger.info(profile.username + "-" + log_type + ":" + log_content)
