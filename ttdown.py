# Code By HanX-ID
# 30-5-2025

import os
import requests
import random
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Warna terminal
merah = "\033[91m"
putih = "\033[97m"
cyan = "\033[96m"
biru = "\033[94m"
ijo = "\033[92m"
kuning = "\033[93m"
reset = "\033[0m"

# Banner
os.system('clear')
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

# Input TikTok link
tt_url = input(f"{kuning}[{putih}+{kuning}]{cyan} Masukkan link TikTok: {reset}").strip()
if not tt_url:
    print(f"{merah}[{putih}!{merah}]{cyan} Link tidak boleh kosong.{reset}")
    exit()

# Pilihan format
os.system('clear')
print(banner)
print(f"{kuning}[{putih}1{kuning}]{cyan} Unduh Video (.mp4){reset}")
print(f"{kuning}[{putih}2{kuning}]{cyan} Unduh Audio (.mp3){reset}")
pilih = input(f"{kuning}[{putih}+{kuning}]{cyan} Pilih [1/2]: {reset}").strip()

if pilih == '1':
    tipe = 'video'
    ekstensi = 'mp4'
elif pilih == '2':
    tipe = 'audio'
    ekstensi = 'mp3'
else:
    print(f"{merah}[{putih}!{merah}]{cyan} Pilihan tidak valid.{reset}")
    exit()

try:
    # Ambil data dari API
    api = f"https://fastrestapis.fasturl.cloud/downup/ttdown?url={tt_url}"
    res = requests.get(api, verify=False)
    data = res.json()

    if data.get("status") != 200 or "result" not in data:
        print(f"{merah}[{putih}!{merah}]{cyan} Gagal ambil data dari API.{reset}")
        exit()

    result = data["result"]
    media_url = result["media"]["videoUrl"] if tipe == 'video' else result["media"]["musicUrl"]

    # Buat nama file random
    rand = str(random.randint(10000000, 99999999))
    nama_file = f"ttdown_{rand}.{ekstensi}"

    # Buat folder simpan
    folder = "/storage/emulated/0/Download/TT-DOWN"
    os.makedirs(folder, exist_ok=True)
    path_file = os.path.join(folder, nama_file)

    # Unduh media
    with requests.get(media_url, stream=True, verify=False) as r:
        with open(path_file, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)

    # Scan file tanpa print ke terminal
    import subprocess
    subprocess.run(
        ["am", "broadcast", "-a", "android.intent.action.MEDIA_SCANNER_SCAN_FILE", "-d", f"file://{path_file}"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    print(f"\n{ijo}[✓]{cyan} File berhasil disimpan ke: {putih}{path_file}{reset}{reset}")

except Exception as e:
    print(f"{merah}[{putih}!{merah}]{cyan} Terjadi kesalahan: {e}{reset}")