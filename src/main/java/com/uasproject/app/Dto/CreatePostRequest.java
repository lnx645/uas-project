package com.uasproject.app.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePostRequest {
    private String content;
    private String intent;
    private String title;
    private Boolean isAnonymous;
    private String visibility;
}
