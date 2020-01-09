 # from dc-ocr folder inside the DC S7 folder
 # $1 - 164
 ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/Detective Conan (1999) S07 0$1.mkv" -c:a copy -filter:v "crop=in_w:100:0:in_h-115" "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1.mp4"
 # from root of this repo
 mkdir public/episode$1
 ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop$1.mp4" public/episode$1/frame%06d.jpg
 node group.js public/episode$1
