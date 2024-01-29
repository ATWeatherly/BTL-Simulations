import csv
import json

# with open('data.csv', 'r') as file:
#     reader = csv.reader(file)
#     lines = list(reader)

# xy_start_index = 0
# for i, line in enumerate(lines):
#     if line[0] == 'XYDATA':
#         xy_start_index = i + 1
#         break

# xy_data = {}
# for line in lines[xy_start_index:]:
#     if len(line) == 0: break
#     x, y = line
#     xy_data[x] = y

# json_data = {
#     "xyvalues": xy_data
# }

# with open('data.json', 'w') as jsonfile:
#     json.dump({'xyvalues': xy_data}, jsonfile, indent=4)

with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    lines = list(reader)

# Find the starting index of the XY data
xy_start_index = 0
for i, line in enumerate(lines):
    if line[0] == 'XYDATA':
        xy_start_index = i + 1
        break

# Extract the XY data
x_values = []
y_values = []
for line in lines[xy_start_index:]:
    if len(line) == 0: break
    x, y = map(float, line)
    x_values.append(x)
    y_values.append(y)

# Create a JSON object with the XY data
json_data = {
    "xyvalues": [x_values, y_values]
}

# Print the JSON object
with open('data.json', 'w') as jsonfile:
    json.dump(json_data, jsonfile, indent=4)