 # from dc-ocr folder inside the DC S7 folder
 ffmpeg -i "../Detective Conan (1999) S07 0164.mkv" -c:a copy -filter:v "crop=in_w:100:0:in_h-115" crop164.mp4
 # from root of this repo
 mkdir public/frames164
 ffmpeg -i "D:/Videos/Anime/Detective Conan [nyaa.si]/Detective Conan (1999) S07/dc-ocr/crop164.mp4" public/frames164/frame%06d.jpg
 node group.js public/frames164
