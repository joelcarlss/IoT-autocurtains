import urequests


url = "http://localhost:3000/"
r = urequests.get(url)
# r = urequests.post(url, json={"dht_T": 'dht_T', "dht_RH": 'dht_RH'})
print(r)
print(r.content)
print(r.text)
print(r.content)
print(r.json())

# It's mandatory to close response objects as soon as you finished
# working with them. On MicroPython platforms without full-fledged
# OS, not doing so may lead to resource leaks and malfunction.
r.close()
