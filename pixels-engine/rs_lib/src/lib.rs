use std::io::{Cursor, Read, Seek, SeekFrom};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}

#[wasm_bindgen]
pub fn greet(message: &str) -> String {
  format!("Welcome to {}!", message)
}

#[wasm_bindgen]
pub fn holler(message: &str) -> String {
  greet(message).to_uppercase()
}

#[wasm_bindgen]
pub fn grayscale(image_buffer: Vec<u8>) -> Vec<u8> {
  let image = image::load_from_memory(&image_buffer).unwrap();
  let image = image.grayscale();

  let mut c = Cursor::new(Vec::new());
  
  image.write_to(&mut c, image::ImageOutputFormat::Jpeg(100)).unwrap();
  
  c.seek(SeekFrom::Start(0)).unwrap();

  // Read the "file's" contents into a vector
  let mut out = Vec::new();
  c.read_to_end(&mut out).unwrap();

  out
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    let result = add(1, 2);
    assert_eq!(result, 3);
  }
}
