
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Profile, Strategy } from "passport-google-oauth20";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken,"accessToken");
        console.log(refreshToken,"refreshToken");
        console.log(profile,"profile");
        const user = await this.authService.validateGoogleUser({displayName: profile.displayName, email: profile.emails[0].value})
        return user || null;
    }
}