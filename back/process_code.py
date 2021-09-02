from modsandbox.models import User, Post, Log, Config
import re


def update_log(log_item, code):
    word_reg = r"\'([^']*)\'"
    check_reg = r"(.*)\:"
    mod_reg = r"\((.*)\)"
    sections = [section for section in re.split("^---", code, flags=re.MULTILINE) if section]

    string_count = len(re.findall(word_reg, code))
    check_count = len(re.findall(check_reg, code))
    rule_count = len(sections)
    mod_count = len(re.findall(mod_reg, code))

    log_item.string_count = string_count
    log_item.check_count = check_count
    log_item.rule_count = rule_count
    log_item.mod_count = mod_count

    log_item.save()


autosave_logs = Log.objects.filter(info='autosave config')
apply_config_logs = Log.objects.filter(info='apply config')
submit_config_logs = Log.objects.filter(info='submit config')
print('autosave number: ', autosave_logs.count())
print('apply_config number: ', apply_config_logs.count())
print('submit_config number: ', submit_config_logs.count())

for (count, log) in enumerate(apply_config_logs):
    print('apply_config_count', count)
    if log.config is not None and log.test_tp is not None:
        update_log(log, log.config.code)

for (count, log) in enumerate(autosave_logs):
    print('auto_save_count', count)
    if log.content is not None and log.test_tp is not None:
        update_log(log, log.content)

for (count, log) in enumerate(submit_config_logs):
    print('submit_config_count', count)
    if log.config is not None and log.test_tp is not None:
        update_log(log, log.config.code)
