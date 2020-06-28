from mqtt import MQTTClient
import machine
import time
import ujson
from curtain import Curtain
from stepper import Motor

# step, dir, enable
m = Motor('P6', 'P7', 'P8')
c = Curtain(m)


def sub_cb(topic, msg):
    print(msg)
    try:
        percent = int(msg)
        c.setPercent(percent)
    except Exception as e:
        print(e)


with open('env.json') as fp:
    data = ujson.load(fp)

# TODO: Fix memory error in MQTT
# OSError: [Errno -1] ERR_MEM

client = MQTTClient("solarfruit14", "io.adafruit.com",
                    user=data["mqtt"]["username"], password=data["mqtt"]["password"], port=1883)

client.set_callback(sub_cb)
client.connect()
client.subscribe(topic="joelcarlss/feeds/autocurtain")

print('Sending current value')
client.publish(topic="joelcarlss/feeds/autocurtain", msg="0")
print("Listening")
while True:  # TODO: integrate manual control, button or joystick
    client.check_msg()
    time.sleep(2)
