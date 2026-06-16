package com.uasproject.app.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileEditRequestDto {
    private String email;
    private String name;
    private String bio;
    private String credential;
}
