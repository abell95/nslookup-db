import socket
import random
import struct
import time

__all__ = ['Tracer']


class Tracer(object):
    def __init__(self, dst, hops=30):

        self.dst = dst
        self.hops = hops
        self.ttl = 1

        # Pick up a random port in the range 33434-33534
        self.port = random.choice(range(33434, 33535))

    def run(self):

        try:
            dst_ip = socket.gethostbyname(self.dst)
        except socket.error as e:
            raise IOError('Unable to resolve {}: {}', self.dst, e)

        text = 'traceroute to {} ({}), {} hops max'.format(
            self.dst,
            dst_ip,
            self.hops
        )

        print(text)

        while True:
            startTimer = time.time()
            receiver = self.create_receiver()
            sender = self.create_sender()
            sender.sendto(b'', (self.dst, self.port))

            addr = None
            try:
                data, addr = receiver.recvfrom(2048)
                entTimer = time.time()
            except socket.error as e:
                raise IOError('Socket error: {}'.format(e))
            finally:
                receiver.close()
                sender.close()

            if addr:
                timeCost = round((entTimer - startTimer) * 1000, 2)
                print('{:<4} {} {} ms'.format(self.ttl, addr[0], timeCost))
                if addr[0] == dst_ip:
                    break
            else:
                print('{:<4} *'.format(self.ttl))

            self.ttl += 1

            if self.ttl > self.hops:
                break

    def create_receiver(self):
        s = socket.socket(
            family=socket.AF_INET,
            type=socket.SOCK_RAW,
            proto=socket.IPPROTO_ICMP
        )

        timeout = struct.pack("ll", 5, 0)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_RCVTIMEO, timeout)

        try:
            s.bind(('', self.port))
        except socket.error as e:
            raise IOError('Unable to bind receiver socket: {}'.format(e))

        return s

    def create_sender(self):

        s = socket.socket(
            family=socket.AF_INET,
            type=socket.SOCK_DGRAM,
            proto=socket.IPPROTO_UDP
        )

        s.setsockopt(socket.SOL_IP, socket.IP_TTL, self.ttl)

        return s


tracer = Tracer("www.google.com", 30)

tracer.run()
