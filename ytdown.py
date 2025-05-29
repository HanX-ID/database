# Code By HanX-ID
# 29-5-2025

import os
import requests
import urllib3
import sys

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# warna terminal
merah = "\033[91m"
putih = "\033[97m"
cyan = "\033[96m"
biru = "\033[94m"
ijo = "\033[92m"
kuning = "\033[93m"
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

yt_url = input(f"{kuning}[{putih}+{kuning}]{cyan} Masukkan link YouTube: {reset}").strip()
if not yt_url:
    print(f"{merah}[{putih}!{merah}]{cyan} Link tidak boleh kosong.{reset}")
    exit()

os.system('clear')
print(banner)
print(f"{kuning}[{putih}1{kuning}]{cyan} Unduh Audio (.mp3){reset}")
print(f"{kuning}[{putih}2{kuning}]{cyan} Unduh Video (.mp4){reset}")
format_pilihan = input(f"{kuning}[{putih}+{kuning}]{cyan} Pilih [1/2]: {reset}").strip()

if format_pilihan == '1':
    api = f"https://fastrestapis.fasturl.cloud/downup/ytmp3?url={yt_url}&quality=128kbps&server=auto"
    ekstensi = "mp3"
elif format_pilihan == '2':
    api = f"https://fastrestapis.fasturl.cloud/downup/ytmp4?url={yt_url}&quality=480&server=auto"
    ekstensi = "mp4"
else:
    print(f"\n{merah}[{putih}!{merah}]{cyan} Pilihan tidak valid.{reset}")
    exit()

try:
    res = requests.get(api, verify=False)
    data = res.json()

    if data.get("status") != 200 or "result" not in data:
        print(f"\n{merah}[{putih}!{merah}]{cyan} Gagal mengambil data dari API.{reset}")
        exit()

    result = data["result"]
    title = result["title"].replace("/", "_").replace("\\", "_")
    download_url = result["media"]

    folder = "/storage/emulated/0/Download/YT-DOWN"
    if not os.path.exists(folder):
        os.makedirs(folder)

    path_file = os.path.join(folder, f"{title}.{ekstensi}")

    with requests.get(download_url, stream=True, verify=False) as r:
        with open(path_file, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)

    print(f"\n{ijo}[✓]{cyan} Berhasil disimpan ke {putih}{folder}{reset}\n")

except Exception as e:
    print(f"\n{merah}[{putih}!{merah}]{cyan} Terjadi kesalahan: {e}{reset}")