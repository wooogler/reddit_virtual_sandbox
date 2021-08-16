# ~body: ['minor']
# {'~body': ['minor']}
import re

code = "~body: ['minor']"
reg = re.compile(r"(\S+)\s*:\s\[\'(\S+)\'\]")

matches = reg.match(code)

obj_code = {}
obj_code[matches.group(1)] = [matches.group(2)]

print(obj_code)
