from mqtt import MQTTClient
import machine
import time
import ujson
from curtain import Curtain

c = Curtain('P10', 'P11')


def sub_cb(topic, msg):
    try:
        percent = int(msg)
        c.setPercent(percent)
    except Exception as e:
        print(e)


with open('env.json') as fp:
    data = ujson.load(fp)

print(data["mqtt"]["username"])

client = MQTTClient("solarfruit14", "io.adafruit.com",
                    user=data["mqtt"]["username"], password=data["mqtt"]["password"], port=1883)

client.set_callback(sub_cb)
client.connect()
client.subscribe(topic="joelcarlss/feeds/autocurtain")

print('Sending current value')
client.publish(topic="joelcarlss/feeds/autocurtain", msg="0")
print("Listening")
while True:
    client.check_msg()
    time.sleep(2)
