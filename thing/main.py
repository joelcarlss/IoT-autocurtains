from mqtt import MQTTClient
import machine
import time
import ujson
import _thread
import pycom
from curtain import Curtain
from stepper import Motor

pycom.heartbeat(False)

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
            send_current_position()

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


def send_current_position():
    print('Sending current value')
    current = c.getCurrentPercent()
    client.publish(topic=topic_auto, msg=str(current))


print('Going one lap up')
c.force_up()
send_current_position()

print("Listening")


def interval_ping(j_):
    while True:
        client.ping()
        time.sleep(j_)

        # def interval_send(t_):
        #     while True:
        #         send_value()
        #         time.sleep(t_)


def listen_command(i_):
    while True:
        client.check_msg()
        time.sleep(i_)


# _thread.start_new_thread(interval_send, [10])
_thread.start_new_thread(listen_command, [1])
_thread.start_new_thread(interval_ping, [60])
