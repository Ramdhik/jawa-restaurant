# Gunakan image Nginx resmi sebagai base image
FROM nginx:alpine

# Hapus konfigurasi default Nginx (opsional, tapi disarankan untuk kebersihan)
RUN rm /etc/nginx/conf.d/default.conf

# Salin file konfigurasi Nginx kustom Anda (jika ada)
# Ini penting jika Anda memiliki konfigurasi spesifik, misalnya untuk routing atau SSL
# Jika tidak ada, Nginx akan menyajikan dari lokasi default-nya
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin semua file HTML Anda ke direktori yang disajikan oleh Nginx
# Pastikan jalur ini sesuai dengan konfigurasi Nginx Anda
COPY . /usr/share/nginx/html

# Port yang akan diekspos oleh container
EXPOSE 80

# Perintah untuk menjalankan Nginx saat container dimulai
CMD ["nginx", "-g", "daemon off;"]