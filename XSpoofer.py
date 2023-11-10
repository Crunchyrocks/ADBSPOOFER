import tkinter as tk
from PIL import Image, ImageTk
import subprocess
import shutil
import time


spoofer_running = False
process_spoofer = None
process_gps_changer = None


def resize_image():
    try:
        image = Image.open("DATA/joystick.png")
        resized_image = image.resize((200, 200), Image.ANTIALIAS)
        return ImageTk.PhotoImage(resized_image)
    except Exception as e:
        print(f"Error resizing image: {e}")
        return None

def find_npm_executable():
    
    common_npm_paths = [
        'C:\\Program Files\\nodejs\\npm.cmd',
        'C:\\Program Files\\nodejs\\npm',
        'C:\\Program Files (x86)\\nodejs\\npm.cmd',
        'C:\\Program Files (x86)\\nodejs\\npm',
    ]

    for path in common_npm_paths:
        if shutil.which(path):
            return path

    return None

def stop_gps_changer():
    global process_gps_changer

    if process_gps_changer:
        try:
            
            process_gps_changer.terminate()
            process_gps_changer.wait()
            process_gps_changer = None
        except Exception as e:
            print(f"Error stopping GPS CHANGER GUI: {e}")

def toggle_spoofer():
    global spoofer_running, process_spoofer, process_servers

    if spoofer_running:
        if process_spoofer:
            
            process_spoofer.terminate()
            process_spoofer = None
        if process_servers:
            
            process_servers.terminate()
            process_servers = None
        start_spoofer_button.config(text="Start Spoofer")
    else:
        npm_executable = find_npm_executable()
        if npm_executable:
            try:
                
                process_servers = subprocess.Popen(["start_servers.bat"], cwd='DATA', shell=True)
                
                time.sleep(5)
                
                process_spoofer = subprocess.Popen([npm_executable, 'start', 'app.js'], cwd='DATA')
                start_spoofer_button.config(text="Stop Spoofer")
            except Exception as e:
                print(f"Error starting spoofer: {e}")
        else:
            print("npm executable not found. Please make sure Node.js is installed.")

    spoofer_running = not spoofer_running


 
root = tk.Tk()
root.title("XSPOOFER V2.4.2")
root.geometry("430x270")


joystick_image = resize_image()


image_label = tk.Label(root, image=joystick_image)
image_label.pack()


button_frame = tk.Frame(root)
button_frame.pack(pady=20)


start_spoofer_button = tk.Button(button_frame, text="Start Spoofer", command=toggle_spoofer)
start_spoofer_button.pack()

root.mainloop()
