package com.uasproject.app.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
