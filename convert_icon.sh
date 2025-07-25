#!/bin/bash

# Script to convert favicon.ico to Android app icon sizes
# Requires ImageMagick to be installed

echo "Converting favicon.ico to Android app icon sizes..."

# Create output directories if they don't exist
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Convert favicon.ico to different sizes for Android
convert public/favicon.ico -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert public/favicon.ico -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert public/favicon.ico -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert public/favicon.ico -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert public/favicon.ico -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Create round versions
convert public/favicon.ico -resize 48x48 -background transparent -gravity center -extent 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert public/favicon.ico -resize 72x72 -background transparent -gravity center -extent 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert public/favicon.ico -resize 96x96 -background transparent -gravity center -extent 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert public/favicon.ico -resize 144x144 -background transparent -gravity center -extent 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert public/favicon.ico -resize 192x192 -background transparent -gravity center -extent 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

# Create foreground versions for adaptive icons (108x108 dp)
convert public/favicon.ico -resize 108x108 -background transparent -gravity center -extent 108x108 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
convert public/favicon.ico -resize 162x162 -background transparent -gravity center -extent 162x162 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
convert public/favicon.ico -resize 216x216 -background transparent -gravity center -extent 216x216 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
convert public/favicon.ico -resize 324x324 -background transparent -gravity center -extent 324x324 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
convert public/favicon.ico -resize 432x432 -background transparent -gravity center -extent 432x432 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png

echo "Icon conversion complete!"
echo "Generated icons in android/app/src/main/res/mipmap-*/ directories" 