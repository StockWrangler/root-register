import time
import threading

# -----------------------------
# 64-bit Snowflake ID Generator
# -----------------------------
machine_id = 1
sequence = 0
lock = threading.Lock()

def generate_snowflake_id():
    global sequence
    with lock:
        timestamp = int(time.time() * 1000)
        snowflake = (timestamp << 22) | (machine_id << 12) | sequence
        sequence = (sequence + 1) & 0xFFF
        return snowflake

# -----------------------------
# Base62 Encoding
# -----------------------------
BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

def encode_base62(num):
    if num == 0:
        return BASE62[0]
    encoded = []
    while num > 0:
        num, rem = divmod(num, 62)
        encoded.append(BASE62[rem])
    return ''.join(reversed(encoded))

# -----------------------------
# Public ID Generator
# -----------------------------
def generate_public_id(internal_id):
    return f"RR-{encode_base62(internal_id)}"
