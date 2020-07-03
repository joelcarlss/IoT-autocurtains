from network import WLAN
import machine
import ujson
import pycom

pycom.pybytes_on_boot(False)

with open('env.json') as fp:
    data = ujson.load(fp)


wlan = WLAN(mode=WLAN.STA)
wlan.connect(data["wifi"]["ssid"], auth=(
    WLAN.WPA2, data["wifi"]["password"]), timeout=5000)

while not wlan.isconnected():
    machine.idle()
print("Connected to WiFi\n")
