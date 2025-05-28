# Code By HanX-ID
# 28-5-2025

import os
import requests
import urllib3
import sys
from time import sleep

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# warna terminal
merah = "\033[91m"
putih = "\033[97m"
cyan = "\033[96m"
biru = "\033[94m"
reset = "\033[0m"

# clear terminal
os.system('clear')

# banner
banner = f"""{biru}
⠀⠀⠀⠀⢀⡠⠤⠔⢲⢶⡖⠒⠤⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣠⡚⠁⢀⠀⠀⢄⢻⣿⠀⠀⠀⡙⣷⢤⡀⠀⠀⠀⠀⠀⠀
⠀⡜⢱⣇⠀⣧⢣⡀⠀⡀⢻⡇⠀⡄⢰⣿⣷⡌⣢⡀⠀⠀⠀⠀
⠸⡇⡎⡿⣆⠹⣷⡹⣄⠙⣽⣿⢸⣧⣼⣿⣿⣿⣶⣼⣆⠀⠀⠀
⣷⡇⣷⡇⢹⢳⡽⣿⡽⣷⡜⣿⣾⢸⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀
⣿⡇⡿⣿⠀⠣⠹⣾⣿⣮⠿⣞⣿⢸⣿⣛⢿⣿⡟⠯⠉⠙⠛⠓
⣿⣇⣷⠙⡇⠀⠁⠀⠉⣽⣷⣾⢿⢸⣿⠀⢸⣿⢿⠀⠀⠀⠀⠀
⡟⢿⣿⣷⣾⣆⠀⠀⠘⠘⠿⠛⢸⣼⣿⢖⣼⣿⠘⡆⠀⠀⠀⠀
⠃⢸⣿⣿⡘⠋⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⡆⠇⠀⠀⠀⠀
⠀⢸⡿⣿⣇⠀⠈⠀⠤⠀⠀⢀⣿⣿⣿⣿⣿⣿⣧⢸⠀⠀⠀⠀
⠀⠈⡇⣿⣿⣷⣤⣀⠀⣀⠔⠋⣿⣿⣿⣿⣿⡟⣿⡞⡄⠀⠀⠀
⠀⠀⢿⢸⣿⣿⣿⣿⣿⡇⠀⢠⣿⡏⢿⣿⣿⡇⢸⣇⠇⠀⠀⠀
⠀⠀⢸⡏⣿⣿⣿⠟⠋⣀⠠⣾⣿⠡⠀⢉⢟⠷⢼⣿⣿⠀⠀⠀
⠀⠀⠈⣷⡏⡱⠁⠀⠊⠀⠀⣿⣏⣀⡠⢣⠃⠀⠀⢹⣿⡄⠀⠀
⠀⠀⠘⢼⣿⠀⢠⣤⣀⠉⣹⡿⠀⠁⠀⡸⠀⠀⠀⠈⣿⡇⠀⠀
{reset}"""

print(banner)

judul = input(f"{merah}[{putih}+{merah}]{cyan} Masukkan judul lagu: {reset}").strip()
if not judul:
    print(f"{merah}[{putih}!{merah}]{cyan} judul lagu tidak boleh kosong.{reset}")
    exit()

# folder & path
folder_path = "/storage/emulated/0/Music"
file_name = f"{judul}.mp3"
full_path = os.path.join(folder_path, file_name)

if not os.path.exists(folder_path):
    os.makedirs(folder_path)

# ambil url download
try:
    url = f"https://api.kenshiro.cfd/api/downloader/play?q={judul}"
    res = requests.get(url, verify=False)
    data = res.json()

    if not data.get("status") or not data.get("data", {}).get("downloadLink"):
        print(f"{merah}[{putih}!{merah}]{cyan} gagal mendapatkan lagu.{reset}")
        exit()

    link = data["data"]["downloadLink"]
    with requests.get(link, stream=True, verify=False) as r:
        total = int(r.headers.get('content-length', 0))
        downloaded = 0

        with open(full_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    percent = int((downloaded / total) * 100)
                    sys.stdout.write(f"\r{merah}[{putih}+{merah}]{cyan} Proses... ({percent}%) {reset}")
                    sys.stdout.flush()

    print(f"\n{merah}[{putih}+{merah}]{cyan} Berhasil di simpan ke {full_path}{reset}")

except Exception as e:
    print(f"\n{merah}[{putih}!{merah}]{cyan} terjadi kesalahan: {e}{reset}")
