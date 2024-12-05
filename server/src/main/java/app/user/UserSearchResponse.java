package app.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSearchResponse {
    private Integer id;
    private String username;
    private String imageUrl;
}
