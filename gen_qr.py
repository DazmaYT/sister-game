import qrcode

# Текст для QR-кода
data = "SYSTEM-18-QR"

# Генерируем и сохраняем картинку
img = qrcode.make(data)
img.save("system_qr.png")
print("Готово! QR-код сохранен как system_qr.png")