package config

import (
	"context"
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var Cld *cloudinary.Cloudinary

func SetupCloudinary() {
	cldUrl := os.Getenv("CLOUDINARY_URL")
	if cldUrl == "" {
		log.Println("Warning: CLOUDINARY_URL is not set. Image uploading may fail.")
		return
	}

	cld, err := cloudinary.NewFromURL(cldUrl)
	if err != nil {
		log.Fatal("Failed to initialize Cloudinary", err)
	}

	Cld = cld
}

func UploadImage(file interface{}) (string, error) {
	ctx := context.Background()
	resp, err := Cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "khanhlinh_products",
	})
	if err != nil {
		return "", err
	}
	return resp.SecureURL, nil
}
