from mqtt import MQTTClient
import machine
import time
import ujson
import _thread
from curtain import Curtain
from stepper import Motor

# step, dir, enable
m = Motor('P6', 'P7', 'P8')
c = Curtain(m)


with open('env.json') as fp:
    data = ujson.load(fp)

# TODO: Fix memory error in MQTT
# OSError: [Errno -1] ERR_MEM


def sub_cb(topic, msg):
    topic = topic.decode("utf-8")
    print(msg)
    print(topic)
    try:

        if topic == topic_auto:
            percent = int(msg)
            c.setPercent(percent)
        elif topic == topic_man:
            level = int(msg)
            print(level)
            c.force_level(level)

    except Exception as e:
        print(e)


client = MQTTClient(
    "solarfruit14", "io.adafruit.com",
    user=data["mqtt"]["username"],
    password=data["mqtt"]["password"], port=1883)

topic_auto = "joelcarlss/feeds/autocurtain"
topic_man = "joelcarlss/feeds/curtain"

client.set_callback(sub_cb)
client.connect()
client.subscribe(topic="joelcarlss/feeds/autocurtain")
client.subscribe(topic="joelcarlss/feeds/curtain")

print('Sending current value')
client.publish(topic=topic_auto, msg="0")
print("Listening")
# TODO: integrate manual control, button or joystick. Maybe separate channel?


def listen_command(i_):
    while True:
        client.check_msg()
        time.sleep(i_)


# _thread.start_new_thread(interval_send, [10])
_thread.start_new_thread(listen_command, [0.1])
