
import i2c_read
import ujson
import time
import read_dht
import pycom
import _thread
from mqtt import MQTTClient
import ubinascii
import hashlib
import machine

with open('env.json') as fp:
    data = ujson.load(fp)


def sub_cb(topic, msg):
    print((topic, msg))


def interval_send(t_):
    while True:
        send_value()
        time.sleep(t_)


def blink_led():
    for n in range(1):
        pycom.rgbled(0xfcfc03)
        time.sleep(0.5)
        pycom.rgbled(0x000000)
        time.sleep(0.2)


def send_value():
    try:
        c.publish(topic_pub, 'msg')
        print('Sensor data sent ..')
        blink_led()

    except (NameError, ValueError, TypeError):
        print('Failed to send!')


# topic = 'testtopic7891/1'
# broker_url = 'broker.hivemq.com' # HiveMQ can be used for testing, open broker

topic_pub = 'joelcarlss/feeds/curtain/'
topic_sub = 'joelcarlss/feeds/autocurtain'
broker_url = "io.adafruit.com"
# create a md5 hash of the pycom WLAN mac
client_name = ubinascii.hexlify(hashlib.md5(machine.unique_id()).digest())

c = MQTTClient(client_name, broker_url,
               user=data["mqtt"]["username"], password=data["mqtt"]["password"])
c.set_callback(sub_cb)
c.connect()
c.subscribe(topic_sub)

# not used at the moment in this code. But - if you want to have something sent
# back to the device run this function in a loop (or in a thread)


def listen_command():
    while True:
        if True:
            # Blocking wait for message
            c.wait_msg()
        else:
            # Non-blocking wait for message
            c.check_msg()
            # Then need to sleep to avoid 100% CPU usage (in a real
            # app other useful actions would be performed instead)
            time.sleep(3)


_thread.start_new_thread(interval_send, [10])
