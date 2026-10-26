import urllib.request
import ssl
import os
import time

ctx = ssl._create_unverified_context()

BASE_URL = "https://raw.githubusercontent.com/hainguyents13/mechvibes/main/src/audio"

SWITCH_MAPPINGS = {
    "holy-panda": {
        "source": "holy-pandas",
        "subpath": "",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    },
    "cherry-blue": {
        "source": "mxblue-travel",
        "subpath": "press/",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    },
    "nk-cream": {
        "source": "cream-travel",
        "subpath": "press/",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    },
    "cherry-brown": {
        "source": "mxbrown-travel",
        "subpath": "press/",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    },
    "cherry-black": {
        "source": "mxblack-travel",
        "subpath": "press/",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    },
    "turquoise": {
        "source": "turquoise",
        "subpath": "press/",
        "files": ["GENERIC_R0.mp3", "GENERIC_R1.mp3", "GENERIC_R2.mp3", "GENERIC_R3.mp3", "GENERIC_R4.mp3", "SPACE.mp3", "ENTER.mp3", "BACKSPACE.mp3"]
    }
}

DEST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "sounds"))

def download_file(url, target_path, retries=3):
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "KeySonic/1.0"})
            with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
                content = response.read()
                if len(content) > 100:
                    with open(target_path, "wb") as f:
                        f.write(content)
                    return True
                else:
                    print(f"File too small ({len(content)} bytes) for {url}")
        except Exception as e:
            print(f"Attempt {attempt} failed for {url}: {e}")
            time.sleep(1)
    return False

def main():
    print(f"Target directory: {DEST_DIR}")
    for switch_name, info in SWITCH_MAPPINGS.items():
        switch_dir = os.path.join(DEST_DIR, switch_name)
        os.makedirs(switch_dir, exist_ok=True)
        print(f"\nDownloading authentic switch audio: {switch_name}...")
        for fname in info["files"]:
            target_path = os.path.join(switch_dir, fname)
            if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
                print(f"  [OK] {fname} (cached)")
                continue
            url = f"{BASE_URL}/{info['source']}/{info['subpath']}{fname}"
            success = download_file(url, target_path)
            if success:
                print(f"  [DOWNLOADED] {fname} ({os.path.getsize(target_path)} bytes)")
            else:
                print(f"  [FAILED] {fname}")

    print("\nDownload process completed.")

if __name__ == "__main__":
    main()
