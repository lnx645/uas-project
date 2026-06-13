package com.uasproject.app.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequestApi {
    private String name;
    private String email;
    private String tahun_angkatan;
    private String password;
    private String jurusan;

}
