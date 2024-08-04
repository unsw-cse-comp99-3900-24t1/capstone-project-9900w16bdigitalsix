package models

import (
	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	ID          uint
	Username    string
	AuthorityId uint
	jwt.StandardClaims
}
