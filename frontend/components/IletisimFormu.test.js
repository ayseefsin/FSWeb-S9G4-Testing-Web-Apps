import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});
beforeEach(() => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  const header = screen.getByText("İletişim Formu");
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const addInput = screen.getByPlaceholderText("İlhan");
  userEvent.type(addInput, "test");
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  //   const addInput = screen.getByPlaceholderText("İlhan");
  //   const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const addInput = screen.getByPlaceholderText("İlhan");
  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(addInput, { target: { value: "Aysinimsi" } });
  fireEvent.change(soyadInput, {
    target: { value: "Nemesisjdjshdjwhdjwshdjwshdjwhs" },
  });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecersizmail" } });
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
    expect(errorMessages[0]).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
  userEvent.type(emailInput, "abc.com");
  const emailHataMesaj = new RegExp(
    "email geçerli bir email adresi olmalıdır.",
    "i"
  );
  expect(screen.getByText(emailHataMesaj)).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const addInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(addInput, { target: { value: "doğru uzunlukta isim" } });
  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages[0]).toHaveTextContent("soyad gereklidir.");
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "doğru uzunlukta isim" } });

  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(soyadInput, { target: { value: "bir soyad" } });

  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "doğru uzunlukta isim" } });

  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(soyadInput, { target: { value: "bir soyad" } });

  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });

  const mesajInput = screen.getByLabelText("Mesaj");
  fireEvent.change(mesajInput, { target: { value: "Test mesajı" } });

  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  await waitFor(() => {
    const ad = screen.getByTestId("firstnameDisplay");
    const soyad = screen.getByTestId("lastnameDisplay");
    const email = screen.getByTestId("emailDisplay");
    const mesaj = screen.getByTestId("messageDisplay");

    expect(ad).toHaveTextContent("doğru uzunlukta isim");
    expect(soyad).toHaveTextContent("bir soyad");
    expect(email).toHaveTextContent("gecerli@mail.com");
    expect(mesaj).toHaveTextContent("Test mesajı");
  });
});
