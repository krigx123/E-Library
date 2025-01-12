import serial
import json
import subprocess
import os

# Serial Communication Configuration
USB_SERIAL_PORT = (
    "COM8"  # Replace with your actual USB serial port (e.g., COM3, /dev/ttyUSB0, etc.)
)
BAUD_RATE = 9600

# File path for the JSON data store
DATA_FILE = "C:/Users/91921/OneDrive/Desktop/Main EL/website/public/books.json"  # Replace with your actual file path

# Git configuration
GIT_REPO_PATH = "C:/Users/91921/OneDrive/Desktop/Main EL/website"
COMMIT_COUNTER_FILE = (
    "C:/Users/91921/OneDrive/Desktop/Main EL/website/commit_counter.txt"
)


# Function to get the next commit message
def get_next_commit_message():
    try:
        if os.path.exists(COMMIT_COUNTER_FILE):
            with open(COMMIT_COUNTER_FILE, "r") as file:
                counter = int(file.read().strip())
        else:
            counter = 0

        counter += 1

        with open(COMMIT_COUNTER_FILE, "w") as file:
            file.write(str(counter))

        return f"Updated books.json pt{counter}"
    except Exception as e:
        print(f"Error managing commit counter: {e}")
        return "Updated books.json"


# Function to push changes to Git
def push_to_git():
    try:
        os.chdir(GIT_REPO_PATH)

        subprocess.run(["git", "add", "books.json"], check=True)
        commit_message = get_next_commit_message()
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push"], check=True)

        print(
            f"Changes pushed to Git repository successfully with message: {commit_message}"
        )
    except subprocess.CalledProcessError as e:
        print(f"Error pushing changes to Git: {e}")


# Function to get the target shelf for a given ISBN
def get_shelf_for_isbn(isbn):
    try:
        with open(DATA_FILE, "r") as file:
            books = json.load(file)

        for book in books:
            if "isbn" in book and book["isbn"] == isbn:
                shelf = book["position"]["shelf"]
                shelf_map = {chr(i + 65): i + 1 for i in range(26)}  # A=1, B=2, etc.
                return shelf_map.get(shelf.upper(), -1)
        return -1
    except Exception as e:
        print(f"Error reading books.json: {e}")
        return -1


# Function to update the status of a book by ISBN
def update_book_status_by_isbn(isbn):
    try:
        with open(DATA_FILE, "r") as file:
            books = json.load(file)

        updated = False
        for book in books:
            if book.get("isbn") == isbn and book.get("status") == "issued":
                book["status"] = "available"
                updated = True
                break

        if updated:
            with open(DATA_FILE, "w") as file:
                json.dump(books, file, indent=4)
            print(f"Book with ISBN {isbn} status updated to 'available'.")
        else:
            print(f"No book with ISBN {isbn} found or not in 'issued' status.")

    except Exception as e:
        print(f"Error updating books.json: {e}")


# Main function to handle serial communication
def main():
    try:
        with serial.Serial(USB_SERIAL_PORT, BAUD_RATE, timeout=5) as usb_serial:
            print(
                f"Connected to Arduino via USB on {USB_SERIAL_PORT}. Waiting for data..."
            )

            while True:
                # Check if there's data from Arduino over USB
                if usb_serial.in_waiting > 0:
                    arduino_data = usb_serial.readline().decode("utf-8").strip()
                    print("Received from Arduino:", arduino_data)

                    if "ISBN" in arduino_data:
                        # Extract the ISBN from the message
                        isbn = arduino_data.split()[-1]
                        print(f"Processing ISBN: {isbn}")

                        # Update the book's status in the JSON file
                        update_book_status_by_isbn(isbn)

                        # Search for the book in the database
                        target_shelf = get_shelf_for_isbn(isbn)
                        if target_shelf != -1:
                            # Send the target shelf back to Arduino
                            response = f"SHELF:{target_shelf}\r\n"
                            usb_serial.write(response.encode("utf-8"))
                            print(f"Sent to Arduino: {response.strip()}")
                        else:
                            # Send a "NOT_FOUND" response to Arduino
                            response = "NOT_FOUND\n"
                            usb_serial.write(response.encode("utf-8"))
                            print(f"Sent to Arduino: {response.strip()}")

    except serial.SerialException as e:
        print(f"Error connecting to Arduino: {e}")
    except KeyboardInterrupt:
        print("Exiting program.")


if __name__ == "__main__":
    main()
