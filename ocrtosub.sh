echo 'Executing... ' node collage.js "$1" "$2" "$3" &&
node collage.js "$1" "$2" "$3" &&
echo &&
echo 'Executing... ' node visionapi.js "$1" "$2" &&
node visionapi.js "$1" "$2" &&
echo &&
echo 'Executing... ' node apitosub.js "$1" "$2" &&
node apitosub.js "$1" "$2"

# for i in {1..9}; do ./ocrtosub.sh 169utb 0$i url || break; done
