import { DiscordIcon, FacebookIcon, GitHubIcon, InstagramIcon, RedditIcon, SocialGrid, SocialIcon, SocialSpacer, TelegramIcon, TwitterIcon, WhatsAppIcon } from "@/components/heliokit/social-grid/SocialGrid"


const SocialGridDemo = () => (
    <SocialGrid>
      <SocialIcon 
        value="instagram" 
        cornerPosition="top-left"
        backgroundColor="linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <InstagramIcon />
      </SocialIcon>

      <SocialIcon 
        value="twitter"
        backgroundColor="#000000"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <TwitterIcon />
      </SocialIcon>

      <SocialIcon 
        value="facebook" 
        cornerPosition="top-right"
        backgroundColor="#1877f2"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <FacebookIcon />
      </SocialIcon>

      <SocialIcon 
        value="whatsapp"
        backgroundColor="#25d366"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <WhatsAppIcon />
      </SocialIcon>

      <SocialSpacer />

      <SocialIcon 
        value="discord"
        backgroundColor="#5865f2"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <DiscordIcon />
      </SocialIcon>

      <SocialIcon 
        value="github" 
        cornerPosition="bottom-left"
        backgroundColor="#000000"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <GitHubIcon />
      </SocialIcon>

      <SocialIcon 
        value="telegram"
        backgroundColor="#0088cc"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <TelegramIcon />
      </SocialIcon>

      <SocialIcon 
        value="reddit" 
        cornerPosition="bottom-right"
        backgroundColor="#ff4500"
        iconColor="#e1e5e9"
        hoverIconColor="#ffffff"
      >
        <RedditIcon />
      </SocialIcon>
    </SocialGrid>
)

export default SocialGridDemo    