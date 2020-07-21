 # from dc-ocr folder inside the DC S7 folder
 # $1 - 164
 ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/Detective Conan (1999) S07 0$1.mkv" -c:a copy -filter:v "crop=in_w:100:0:in_h-115" "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1.mp4"
 # from root of this repo
 mkdir public/episode$1
 ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1.mp4" public/episode$1/frame%06d.jpg
 node group.js public/episode$1

#  ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/[UTB] Detective Conan 128-131,150-156,158-420 [English SUB]/Detective Conan - $1 (OTA,LQ) [UTB].mkv" -c:a copy -filter:v "crop=in_w:100:0:in_h-140" "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1utb.mp4"
#  mkdir public/episode$1utb
#  ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1utb.mp4" public/episode$1utb/frame%06d.jpg
#  node group.js public/episode$1utb

#for i in {1..9}; do curl "https://spoii.tk/episode164/part_0$i/frames.json" > part_0$i.json; done
